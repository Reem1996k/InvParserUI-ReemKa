"""Invoices Page Object Model."""

from playwright.sync_api import Page
from .base_page import BasePage


class InvoicesPage(BasePage):
    """Page Object Model for Invoices page."""

    # Selectors
    VENDOR_INPUT = "#vendor"
    SEARCH_BUTTON_ROLE = "button"
    SEARCH_BUTTON_NAME = "Search"
    VIEW_LINK_ROLE = "link"
    VIEW_LINK_NAME = "View"

    def __init__(self, page: Page):
        """Initialize InvoicesPage.
        
        Args:
            page: Playwright Page instance
        """
        super().__init__(page)

    def goto(self) -> None:
        """Navigate to invoices page."""
        self.navigate_to("/invoices")
        self.wait_for_url(".*/invoices", timeout=self.DEFAULT_TIMEOUT)

    def enter_vendor_search(self, vendor_name: str) -> None:
        """Enter vendor name in search field.
        
        Args:
            vendor_name: Name of vendor to search for
        """
        self.get_by_locator(self.VENDOR_INPUT).fill(vendor_name)

    def click_search(self) -> None:
        """Click Search button."""
        self.get_by_role(self.SEARCH_BUTTON_ROLE, name=self.SEARCH_BUTTON_NAME).click()

    def search_by_vendor(self, vendor_name: str) -> None:
        """Search for invoices by vendor name.
        
        Args:
            vendor_name: Name of vendor to search for
        """
        self.enter_vendor_search(vendor_name)
        self.click_search()

    def click_view_first_result(self) -> None:
        """Click View link on first search result."""
        # Wait for View link to be visible
        self.get_by_role(self.VIEW_LINK_ROLE, name=self.VIEW_LINK_NAME).first.wait_for(
            state="visible", timeout=self.LONG_TIMEOUT
        )
        self.get_by_role(self.VIEW_LINK_ROLE, name=self.VIEW_LINK_NAME).first.click()
