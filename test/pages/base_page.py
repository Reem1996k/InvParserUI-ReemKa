"""Base Page Object Model class with common utilities."""

import re
from playwright.sync_api import Page, expect


class BasePage:
    """Base class for all page objects with common utilities."""

    BASE_URL = "http://localhost:3000"
    DEFAULT_TIMEOUT = 5000
    LONG_TIMEOUT = 30000

    def __init__(self, page: Page):
        """Initialize page object with Playwright page instance.
        
        Args:
            page: Playwright Page instance
        """
        self.page = page

    def navigate_to(self, url: str) -> None:
        """Navigate to a URL.
        
        Args:
            url: URL path or full URL to navigate to
        """
        if not url.startswith("http"):
            url = self.BASE_URL + url
        self.page.goto(url)

    def wait_for_url(self, url_pattern: str, timeout: int = None) -> None:
        """Wait for page URL to match pattern.
        
        Args:
            url_pattern: Regex pattern to match URL
            timeout: Timeout in milliseconds (defaults to DEFAULT_TIMEOUT)
        """
        if timeout is None:
            timeout = self.DEFAULT_TIMEOUT
        expect(self.page).to_have_url(re.compile(url_pattern), timeout=timeout)

    def wait_for_timeout(self, milliseconds: int) -> None:
        """Wait for specified milliseconds.
        
        Args:
            milliseconds: Time to wait in milliseconds
        """
        self.page.wait_for_timeout(milliseconds)

    def clear_local_storage(self) -> None:
        """Clear browser local storage."""
        self.page.evaluate("localStorage.clear()")

    def get_by_role(self, role: str, name: str = None):
        """Get element by role and optional name.
        
        Args:
            role: ARIA role (button, link, textbox, etc.)
            name: Optional element name/text
            
        Returns:
            Locator for the element
        """
        if name:
            return self.page.get_by_role(role, name=name)
        return self.page.get_by_role(role)

    def get_by_locator(self, selector: str):
        """Get element by CSS selector or other locator.
        
        Args:
            selector: CSS selector or locator string
            
        Returns:
            Locator for the element
        """
        return self.page.locator(selector)
