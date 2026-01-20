"""Page Object Models for Invoice Parser UI tests."""

from .base_page import BasePage
from .login_page import LoginPage
from .dashboard_page import DashboardPage
from .upload_page import UploadPage
from .invoices_page import InvoicesPage
from .invoice_detail_page import InvoiceDetailPage

__all__ = [
    "BasePage",
    "LoginPage",
    "DashboardPage",
    "UploadPage",
    "InvoicesPage",
    "InvoiceDetailPage",
]
