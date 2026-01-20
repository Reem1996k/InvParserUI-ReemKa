"""Invoice Detail Page Object Model."""

from playwright.sync_api import Page
from .base_page import BasePage


class InvoiceDetailPage(BasePage):
    """Page Object Model for Invoice Detail page."""

    def __init__(self, page: Page):
        """Initialize InvoiceDetailPage.
        
        Args:
            page: Playwright Page instance
        """
        super().__init__(page)

    def is_on_invoice_detail_page(self) -> bool:
        """Check if currently on an invoice detail page.
        
        Returns:
            True if on invoice detail page, False otherwise
        """
        try:
            self.wait_for_url(".*/invoice/.*", timeout=self.DEFAULT_TIMEOUT)
            return True
        except Exception:
            return False

    def wait_for_invoice_detail_page(self, timeout: int = None) -> None:
        """Wait for invoice detail page to load.
        
        Args:
            timeout: Timeout in milliseconds (defaults to DEFAULT_TIMEOUT)
        """
        if timeout is None:
            timeout = self.DEFAULT_TIMEOUT
        self.wait_for_url(".*/invoice/.*", timeout=timeout)
