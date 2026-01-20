"""Upload Page Object Model."""

from playwright.sync_api import Page
from .base_page import BasePage


class UploadPage(BasePage):
    """Page Object Model for Upload page."""

    # Selectors
    FILE_INPUT = 'input[type="file"]'

    def __init__(self, page: Page):
        """Initialize UploadPage.
        
        Args:
            page: Playwright Page instance
        """
        super().__init__(page)

    def goto(self) -> None:
        """Navigate to upload page."""
        self.navigate_to("/upload")
        self.wait_for_url(".*/upload", timeout=self.DEFAULT_TIMEOUT)

    def upload_file(self, file_path: str) -> None:
        """Upload a file via file input.
        
        Args:
            file_path: Path to the file to upload
        """
        self.get_by_locator(self.FILE_INPUT).set_input_files(file_path)

    def wait_for_upload_completion(self, timeout_ms: int = 15000) -> None:
        """Wait for file upload and backend processing to complete.
        
        Args:
            timeout_ms: Time to wait in milliseconds (default: 15000 for backend processing)
        """
        self.wait_for_timeout(timeout_ms)
