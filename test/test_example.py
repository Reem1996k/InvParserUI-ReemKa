import os
import unittest
import playwright
from playwright.sync_api import sync_playwright
from pages import LoginPage, DashboardPage, UploadPage, InvoicesPage, InvoiceDetailPage

# Path to test invoice file
TEST_INVOICE_PATH = r"C:\Users\רים\ReemKartawe_repo\invoices_sample\invoice_Anthony_Jacobs_37594.pdf"

from playwright.sync_api import sync_playwright
import os

headless = os.getenv('HEADLESS', 'false').lower() == 'true'
browser = playwright.chromium.launch(headless=headless)
page = browser.new_page()
APP_URL = os.getenv('APP_URL', 'http://localhost:3000')

class TestInvParserUI(unittest.TestCase):
    """Test suite for Invoice Parser UI using Page Object Model."""

    @classmethod
    def setUpClass(cls):
        """Set up the browser once for all tests in this class."""
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=headless)  # headless=False to see the browser

    @classmethod
    def tearDownClass(cls):
        """Clean up after all tests are done."""
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        """Set up before each test method."""
        self.page = self.browser.new_page(viewport={"width": 1280, "height": 720})

    def tearDown(self):
        """Clean up after each test method."""
        self.page.evaluate("localStorage.clear()")
        self.page.close()
    

    def test_page_title(self):
        """Test complete invoice workflow: login, upload, search, and view detail."""
        # Check that test invoice file exists
        if not os.path.exists(TEST_INVOICE_PATH):
            self.skipTest(f"Test invoice file not found at: {TEST_INVOICE_PATH}")

        # Initialize page objects
        login_page = LoginPage(self.page)
        dashboard_page = DashboardPage(self.page)
        upload_page = UploadPage(self.page)
        invoices_page = InvoicesPage(self.page)
        invoice_detail_page = InvoiceDetailPage(self.page)

        # Step 1: Navigate to login and perform login
        login_page.goto()
        login_page.login(username="admin", password="admin")

        # Step 2: Navigate to upload page
        dashboard_page.navigate_to_upload()

        # Step 3: Upload invoice file
        upload_page.upload_file(TEST_INVOICE_PATH)
        upload_page.wait_for_upload_completion()

        # Step 4: Navigate to invoices page
        dashboard_page.navigate_to_invoices()

        # Step 5: Search for invoices by vendor
        invoices_page.search_by_vendor("SuperStore")

        # Step 6: Click View on first result
        invoices_page.click_view_first_result()

        # Step 7: Verify we're on invoice detail page
        invoice_detail_page.wait_for_invoice_detail_page()









if __name__ == "__main__":
    unittest.main()