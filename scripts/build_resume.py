"""Build the resume PDFs from Sarvesh_Resume.tex with tectonic.

Writes Sarvesh_Resume.pdf plus one version per hiring lens on the site
(AI, Data, Infra). The versions hold the same content; only the order of the
Groundzero bullets and of the projects changes, so the most relevant work
comes first. Every PDF must stay on one page.

Usage: python3 scripts/build_resume.py   (needs `tectonic` on PATH)
"""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Sarvesh_Resume.tex"

# Each bullet and project is named by the start of its text in the .tex file.
BULLETS = {
    "owned": "Owned end-to-end architecture",
    "analyst": "Built an agentic AI analyst",
    "ontology": "Built Ontology Studio",
    "lineage": "Built column-level data lineage",
    "builder": "Designed a no-code Agent Builder",
    "cost": "Cut LLM costs",
    "lakehouse": "Delivered sub-10-second queries",
    "rag": "Reduced RAG query latency",
    "headroom": "Built headroom-scaler",
    "runtimes": "Hardened multi-tenant runtimes",
}
PROJECTS = {
    "tea": r"\resumeProject{Tea Distribution",
    "agents": r"\resumeProject{WhatsApp Ordering Agent",
    "gz": r"\resumeProject{gz:",
}

# index.html follows these lists through data-order attributes: each detail drawing on
# sheet 2 takes the rank of its first bullet here, and the tea and gz sheets take the rank
# of their first project. Update those attributes when an order here changes.
VARIANTS = {
    "AI": (
        ["owned", "analyst", "builder", "rag", "cost", "ontology", "lineage",
         "lakehouse", "runtimes", "headroom"],
        ["agents", "tea", "gz"],
    ),
    "Data": (
        ["owned", "lakehouse", "lineage", "ontology", "rag", "analyst",
         "runtimes", "cost", "builder", "headroom"],
        ["gz", "tea", "agents"],
    ),
    "Infra": (
        ["owned", "headroom", "runtimes", "lakehouse", "cost", "analyst",
         "lineage", "ontology", "builder", "rag"],
        ["tea", "gz", "agents"],
    ),
}


def find_one(items: list[str], prefix: str) -> str:
    matches = [item for item in items if item.lstrip().removeprefix(r"\item ").startswith(prefix)
               or item.startswith(prefix)]
    if len(matches) != 1:
        sys.exit(f"expected one entry starting with {prefix!r}, found {len(matches)}")
    return matches[0]


def reorder_bullets(tex: str, order: list[str]) -> str:
    start = tex.index(r"\resumeRole{Lead AI Architect}")
    body_start = tex.index(r"\begin{itemize}", start) + len(r"\begin{itemize}")
    body_end = tex.index(r"\end{itemize}", body_start)
    items = [line for line in tex[body_start:body_end].split("\n") if line.strip()]
    if len(items) != len(BULLETS):
        sys.exit(f"expected {len(BULLETS)} Groundzero bullets, found {len(items)}")
    ordered = [find_one(items, BULLETS[key]) for key in order]
    return tex[:body_start] + "\n" + "\n".join(ordered) + "\n" + tex[body_end:]


def reorder_projects(tex: str, order: list[str]) -> str:
    start = tex.index(r"\section*{Projects}") + len(r"\section*{Projects}")
    end = tex.index(r"\section*{Education}")
    blocks = [block.strip("\n") for block in re.split(r"\n(?=\\resumeProject)", tex[start:end])
              if block.strip()]
    if len(blocks) != len(PROJECTS):
        sys.exit(f"expected {len(PROJECTS)} projects, found {len(blocks)}")
    ordered = [find_one(blocks, PROJECTS[key]) for key in order]
    return tex[:start] + "\n" + "\n\n".join(ordered) + "\n\n" + tex[end:]


def compile_pdf(tex: str, output: Path) -> None:
    with tempfile.TemporaryDirectory() as work:
        source = Path(work) / "resume.tex"
        source.write_text(tex)
        subprocess.run(
            ["tectonic", "--keep-logs", "--chatter", "minimal", str(source)],
            check=True,
        )
        log = (Path(work) / "resume.log").read_text(errors="replace")
        pages = re.search(r"Output written on .*?\((\d+) page", log)
        if not pages or pages.group(1) != "1":
            sys.exit(f"{output.name} is not one page; shorten the source first")
        shutil.copyfile(Path(work) / "resume.pdf", output)
    print(f"wrote {output.relative_to(ROOT)}")


def main() -> None:
    if shutil.which("tectonic") is None:
        sys.exit("tectonic is not installed (brew install tectonic)")
    tex = SOURCE.read_text()
    compile_pdf(tex, ROOT / "Sarvesh_Resume.pdf")
    for name, (bullets, projects) in VARIANTS.items():
        variant = reorder_projects(reorder_bullets(tex, bullets), projects)
        compile_pdf(variant, ROOT / f"Sarvesh_Resume_{name}.pdf")


if __name__ == "__main__":
    main()
