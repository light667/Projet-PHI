import sys
from pathlib import Path

import pytest
from pydantic import ValidationError

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from schemas import PortfolioCreate, PortfolioGenerateRequest


def test_portfolio_create_validates_slug():
    portfolio = PortfolioCreate(
        title="Portfolio Dev",
        template="t-dev-1",
        slug="portfolio-dev",
        visibility="private",
        content_json={"sections": []},
    )

    assert portfolio.slug == "portfolio-dev"


def test_portfolio_create_rejects_invalid_slug():
    with pytest.raises(ValidationError):
        PortfolioCreate(title="Portfolio Dev", slug="Portfolio Dev!")


def test_portfolio_generate_request_minimal_valid_payload():
    payload = {
        "userId": "firebase-user",
        "title": "Portfolio IA",
        "slug": "portfolio-ia",
        "domain": "dev",
        "full_name": "Jane Doe",
        "professional_title": "Developpeuse Fullstack",
        "bio": "Developpeuse passionnee avec une experience solide en produits web.",
        "career_goal": "Trouver une mission senior fullstack.",
    }

    req = PortfolioGenerateRequest(**payload)

    assert req.visibility == "public"
    assert req.tone == "professional"
    assert req.theme_variant == "light"
