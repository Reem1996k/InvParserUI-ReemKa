"""Dashboard Page Object Model."""

from playwright.sync_api import Page
from .base_page import BasePage


class DashboardPage(BasePage):
    """Page Object Model for Dashboard page."""

    def __init__(self, page: Page):
        """Initialize DashboardPage.
        
        Args:
            page: Playwright Page instance
        """
        super().__init__(page)

    def goto(self) -> None:
        """Navigate to dashboard page."""
        self.navigate_to("/dashboard")
        self.wait_for_url(".*/dashboard", timeout=self.DEFAULT_TIMEOUT)

    def navigate_to_upload(self) -> None:
        """Navigate to upload page."""
        self.navigate_to("/upload")
        self.wait_for_url(".*/upload", timeout=self.DEFAULT_TIMEOUT)

    def navigate_to_invoices(self) -> None:
        """Navigate to invoices page."""
        self.navigate_to("/invoices")
        self.wait_for_url(".*/invoices", timeout=self.DEFAULT_TIMEOUT)
