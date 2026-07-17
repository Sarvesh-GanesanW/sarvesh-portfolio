from __future__ import annotations

import shutil
from dataclasses import dataclass
from pathlib import Path
from tempfile import NamedTemporaryFile

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    Flowable,
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PDF = ROOT / "Sarvesh_Resume.pdf"
PAGE_WIDTH, _PAGE_HEIGHT = letter
MARGIN = 36


@dataclass(frozen=True)
class Role:
    title: str
    dates: str
    company: str
    location: str
    bullets: tuple[str, ...]


@dataclass(frozen=True)
class Project:
    title: str
    tech: str
    url: str
    bullets: tuple[str, ...]


def build_resume_pdf(output_path: Path = OUTPUT_PDF) -> None:
    """Build the updated resume PDF."""
    last_pdf: Path | None = None
    for body_size in (8.8, 8.6, 8.4, 8.2, 8.0):
        with NamedTemporaryFile(suffix=".pdf", delete=False) as temp_file:
            temp_path = Path(temp_file.name)

        _render_pdf(temp_path, body_size)
        last_pdf = temp_path

        if _page_count(temp_path) == 1:
            shutil.copyfile(temp_path, output_path)
            temp_path.unlink(missing_ok=True)
            return

        temp_path.unlink(missing_ok=True)

    if last_pdf is None:
        raise RuntimeError("PDF rendering did not produce an output file.")

    _render_pdf(output_path, 8.0)


def _styles(body_size: float) -> dict[str, ParagraphStyle]:
    base = ParagraphStyle(
        name="Base",
        fontName="Helvetica",
        fontSize=body_size,
        leading=body_size + 1.45,
        textColor=colors.black,
        spaceAfter=1.3,
        linkUnderline=0,
    )
    return {
        "name": ParagraphStyle(
            name="Name",
            parent=base,
            fontName="Helvetica-Bold",
            fontSize=19,
            leading=20.5,
            alignment=TA_CENTER,
            spaceAfter=3,
        ),
        "contact": ParagraphStyle(
            name="Contact",
            parent=base,
            fontSize=8.0,
            leading=9.2,
            alignment=TA_CENTER,
            spaceAfter=4,
        ),
        "section": ParagraphStyle(
            name="Section",
            parent=base,
            fontName="Helvetica-Bold",
            fontSize=9.6,
            leading=10.8,
            spaceBefore=4.2,
            spaceAfter=1.8,
        ),
        "body": base,
        "bullet": ParagraphStyle(
            name="Bullet",
            parent=base,
            leftIndent=12,
            firstLineIndent=-7,
            bulletIndent=0,
            spaceAfter=1.2,
        ),
        "role": ParagraphStyle(
            name="Role",
            parent=base,
            fontName="Helvetica-Bold",
            spaceAfter=0,
        ),
        "date": ParagraphStyle(
            name="Date",
            parent=base,
            alignment=TA_RIGHT,
            spaceAfter=0,
        ),
        "meta": ParagraphStyle(
            name="Meta",
            parent=base,
            textColor=colors.HexColor("#333333"),
            spaceAfter=1,
        ),
    }


def _render_pdf(output_path: Path, body_size: float) -> None:
    styles = _styles(body_size)
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=25,
        bottomMargin=28,
        title="Sarvesh Ganesan Resume",
        author="Sarvesh Ganesan",
    )
    doc.build(_story(styles, PAGE_WIDTH - (2 * MARGIN)))


def _story(styles: dict[str, ParagraphStyle], width: float) -> list[Flowable]:
    story: list[Flowable] = [
        Paragraph("SARVESH GANESAN", styles["name"]),
        Paragraph(
            "India | "
            '<a href="mailto:sarveshganesan2002@gmail.com" color="black">'
            "sarveshganesan2002@gmail.com</a> | "
            '<a href="https://linkedin.com/in/sarvesh-ganesan09" '
            'color="black">linkedin.com/in/sarvesh-ganesan09</a> | '
            '<a href="https://github.com/Sarvesh-GanesanW" color="black">'
            "github.com/Sarvesh-GanesanW</a>",
            styles["contact"],
        ),
        *_section("PROFESSIONAL SUMMARY", styles),
        Paragraph(
            "Lead AI Architect with 3+ years of experience building and "
            "shipping cloud-native AI and data platforms. Architected 12+ "
            "production microservices spanning agentic AI, distributed ETL, "
            "data lakehousing, and MLOps on AWS EKS. Proven track record of "
            "turning ambiguous product requirements into scalable, "
            "cost-optimized systems for enterprise workloads.",
            styles["body"],
        ),
        *_section("TECHNICAL SKILLS", styles),
    ]

    skill_items = (
        "<b>Languages &amp; Frameworks:</b> Python, FastAPI, Flask, REST APIs, "
        "gRPC, SSE streaming",
        "<b>AI / LLM:</b> AWS Bedrock, Strands Agents, LangChain, LangGraph, "
        "RAG systems, MCP",
        "<b>Data Engineering:</b> Apache Spark, Apache Iceberg, DuckDB, "
        "Pandas, PyArrow, Polars",
        "<b>Databases:</b> PostgreSQL, pgvector, Redis, Pinecone, MongoDB, "
        "Elasticsearch, DynamoDB",
        "<b>Cloud &amp; Infra:</b> AWS (EKS, Bedrock, S3, Lambda, ECR, "
        "CloudWatch), Docker, Kubernetes, Karpenter",
        "<b>MLOps:</b> MLflow, Jupyter, PyTorch, TensorFlow, scikit-learn, "
        "Docker-based GPU runtimes",
    )
    story.extend(_bullets(skill_items, styles))
    story.extend(_section("EXPERIENCE", styles))

    for role in _roles():
        story.extend(_role_block(role, styles, width))

    story.extend(_section("PROJECTS", styles))
    for project in _projects():
        story.extend(_project_block(project, styles, width))

    story.extend(_section("EDUCATION", styles))
    education = Table(
        [
            [
                Paragraph(
                    "<b>Bachelor of Technology: Computer Science and Engineering</b>",
                    styles["body"],
                ),
                Paragraph("May 2023", styles["date"]),
            ],
            [
                Paragraph(
                    "Specialization in Artificial Intelligence and Machine Learning",
                    styles["body"],
                ),
                Paragraph("GPA: 9.08", styles["date"]),
            ],
        ],
        colWidths=(width * 0.7, width * 0.3),
    )
    education.setStyle(_compact_table_style())
    story.append(education)
    story.append(
        Paragraph("SRM Institute of Science and Technology, Chennai", styles["body"])
    )

    story.extend(_section("LANGUAGES", styles))
    story.append(
        Paragraph(
            "English (Fluent) | Tamil (Native) | Telugu (Fluent) | "
            "Hindi (Intermediate)",
            styles["body"],
        )
    )
    return story


def _section(title: str, styles: dict[str, ParagraphStyle]) -> list[Flowable]:
    return [
        Spacer(1, 2.0),
        Paragraph(title, styles["section"]),
        HRFlowable(width="100%", thickness=0.45, color=colors.black, spaceAfter=2.2),
    ]


def _bullets(
    items: tuple[str, ...],
    styles: dict[str, ParagraphStyle],
) -> list[Flowable]:
    return [Paragraph(item, styles["bullet"], bulletText="-") for item in items]


def _role_block(
    role: Role,
    styles: dict[str, ParagraphStyle],
    width: float,
) -> list[Flowable]:
    table = Table(
        [
            [
                Paragraph(f"<b>{role.title}</b>", styles["role"]),
                Paragraph(role.dates, styles["date"]),
            ],
            [
                Paragraph(role.company, styles["meta"]),
                Paragraph(role.location, styles["date"]),
            ],
        ],
        colWidths=(width * 0.68, width * 0.32),
    )
    table.setStyle(_compact_table_style())
    return [table, *_bullets(role.bullets, styles), Spacer(1, 2.2)]


def _project_block(
    project: Project,
    styles: dict[str, ParagraphStyle],
    width: float,
) -> list[Flowable]:
    table = Table(
        [
            [
                Paragraph(
                    f"<b>{project.title}</b> | {project.tech}",
                    styles["body"],
                ),
                Paragraph(
                    f'<a href="{project.url}" color="black">GitHub</a>',
                    styles["date"],
                ),
            ]
        ],
        colWidths=(width * 0.86, width * 0.14),
    )
    table.setStyle(_compact_table_style())
    return [table, *_bullets(project.bullets, styles), Spacer(1, 1.8)]


def _compact_table_style() -> TableStyle:
    return TableStyle(
        [
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]
    )


def _roles() -> tuple[Role, ...]:
    return (
        Role(
            title="Lead AI Architect",
            dates="Sep 2023 - Mar 2026",
            company="Groundzero Software Private Limited",
            location="Chennai, India",
            bullets=(
                "Owned the entire backend architecture end-to-end, designing "
                "and shipping 12+ production microservices for agentic chat, "
                "data providers, ETL orchestration, Iceberg lakehouse APIs, "
                "MLOps, and Spark/DuckDB runtimes as the sole backend engineer.",
                "Built a multi-agent AI system that lets enterprise users "
                "query databases, build dashboards, run ETL jobs, and manage "
                "notebooks through natural language, reducing time-to-insight "
                "from hours of manual work to seconds of conversation.",
                "Scaled data connectivity to 69+ sources through a dynamically "
                "loaded connector architecture with role-based authorization "
                "and schema introspection caching.",
                "Reduced RAG query latency by 90% using hybrid vector plus "
                "full-text retrieval with neural reranking, enabling real-time "
                "document Q&A at production scale.",
                "Delivered sub-10s query performance on 100M+ row datasets by "
                "architecting a TB-scale Apache Iceberg lakehouse with Spark "
                "and DuckDB compute engines.",
                "Cut LLM inference costs with three-tier model routing, "
                "Anthropic prompt caching, and per-request token tracking "
                "across agent workflows.",
                "Designed the ETL orchestration layer for job submission, "
                "multi-job chaining, container log streaming from EKS pods, "
                "and dataset lineage across Spark, DuckDB, and Pandas engines.",
                "Stood up MLOps and platform infrastructure with MLflow, "
                "Jupyter lifecycle management on EKS, GPU training containers, "
                "Karpenter autoscaling, and 99.9% uptime across multi-tenant "
                "deployments.",
            ),
        ),
        Role(
            title="Software Trainee",
            dates="Jun 2023 - Aug 2023",
            company="SCI-BI Software Solutions Private Limited",
            location="Chennai, India",
            bullets=(
                "Built client-facing dashboards and reports in Power BI and "
                "Tableau, and translated client requirements into technical "
                "specifications.",
            ),
        ),
    )


def _projects() -> tuple[Project, ...]:
    return (
        Project(
            title="PayPal Agent",
            tech="Python, LangGraph, FastAPI, pgvector, AWS Bedrock",
            url="https://github.com/Sarvesh-GanesanW/paypal-agent",
            bullets=(
                "Built a PayPal tool router and execution service covering "
                "116 API operations with multi-provider model routing, "
                "hybrid RAG, guarded mutation flows, OAuth token caching, "
                "and a terminal UI.",
                "Added strict Pydantic routing, sandbox execution, "
                "metadata-only memory, LangSmith tracing, and recorded demo "
                "artifacts for a complete, verifiable workflow.",
            ),
        ),
        Project(
            title="SRE Tea MCP Server",
            tech="Node.js, Model Context Protocol, Claude, JWT, AWS Lambda",
            url="https://github.com/Sarvesh-GanesanW/sre-tea-mcp",
            bullets=(
                "Built a production MCP server for live tea e-commerce "
                "administration, exposing 46 tools across orders, products, "
                "customers, inventory, invoices, logistics, churn analytics, "
                "and reporting with automatic token refresh and parallel API "
                "aggregation.",
                "Integrated Claude Desktop, Claude Code, and custom MCP "
                "clients over STDIO transport with secure environment-based "
                "credentials, structured stderr logging, and automatic "
                "recovery from expired JWT sessions.",
            ),
        ),
        Project(
            title="Qualipilot Data Quality Checker",
            tech="Python, Polars, Dask, cuDF, AWS Bedrock",
            url="https://github.com/Sarvesh-GanesanW/dataqualitychecker",
            bullets=(
                "Built a production data-quality CLI/library with missing, "
                "duplicate, type, range, outlier, cardinality, and freshness "
                "checks, CI severity gates, HTML/JSON/Markdown reports, and "
                "optional LLM narration through Bedrock, Ollama, or "
                "OpenAI-compatible endpoints.",
                "Implemented swappable Polars, Pandas, Dask, and cuDF engines "
                "with typed Pydantic results, deterministic JSON output, "
                "Docker/Lambda deployment paths, and probabilistic record "
                "linkage for deduplication.",
            ),
        ),
    )


def _page_count(path: Path) -> int:
    return len(PdfReader(path).pages)


if __name__ == "__main__":
    build_resume_pdf()
