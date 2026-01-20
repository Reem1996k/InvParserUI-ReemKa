"""Login Page Object Model."""

from playwright.sync_api import Page
from .base_page import BasePage


class LoginPage(BasePage):
    """Page Object Model for Login page."""

    # Selectors
    USERNAME_INPUT = "#username"
    PASSWORD_INPUT = "#password"
    SIGN_IN_BUTTON_ROLE = "button"
    SIGN_IN_BUTTON_NAME = "Sign In"

    def __init__(self, page: Page):
        """Initialize LoginPage.
        
        Args:
            page: Playwright Page instance
        """
        super().__init__(page)

    def goto(self) -> None:
        """Navigate to login page."""
        self.navigate_to("/")

    def enter_username(self, username: str) -> None:
        """Enter username in username field.
        
        Args:
            username: Username to enter
        """
        self.get_by_locator(self.USERNAME_INPUT).fill(username)

    def enter_password(self, password: str) -> None:
        """Enter password in password field.
        
        Args:
            password: Password to enter
        """
        self.get_by_locator(self.PASSWORD_INPUT).fill(password)

    def click_sign_in(self) -> None:
        """Click Sign In button."""
        self.get_by_role(self.SIGN_IN_BUTTON_ROLE, name=self.SIGN_IN_BUTTON_NAME).click()

    def login(self, username: str = "admin", password: str = "admin") -> None:
        """Perform login with username and password.
        
        Args:
            username: Username (default: "admin")
            password: Password (default: "admin")
        """
        try:
            self.page.get_by_role("button", name="Visit Site").click()
        except:
            print("Ngrok warning page was not loaded")
        self.enter_username(username)
        self.enter_password(password)
        self.click_sign_in()
        
        # Wait for navigation to dashboard
        self.wait_for_url(".*/dashboard", timeout=self.DEFAULT_TIMEOUT)
