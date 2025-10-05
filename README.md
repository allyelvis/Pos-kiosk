# Modular Commerce POS

A feature-rich, offline-first Point of Sale (POS) application built with modern web technologies. Designed for a modular commerce platform, it facilitates fast in-person checkouts, real-time inventory tracking, and comprehensive order management.

## Key Features

- **Offline-First Functionality**: Seamlessly create orders even without an internet connection. Transactions are queued and synced automatically once connectivity is restored.
- **Intuitive Product & Category Navigation**: A clean, grid-based UI with category tabs and a real-time search function makes finding products quick and easy.
- **Dynamic Cart Management**:
  - Add products to the cart with a single click.
  - Directly edit item quantities in the cart.
  - Smart stock validation prevents overselling.
  - Add or change the customer associated with an order.
- **Streamlined Checkout Process**: A simple, multi-option payment modal for Cash, Card, and Mobile Money.
- **Comprehensive Order History & Management**:
  - View a searchable list of all past transactions.
  - **Edit Orders**: Re-open a completed order to make changes. The original sale is voided and stock is returned.
  - **Void/Cancel Sales**: Cancel transactions and automatically restock the items.
  - **Split Orders**: Divide a single order into multiple transactions.
  - **Transfer Customers**: Reassign an order to a different customer.
- **Store Management**:
  - **Product Management**: Add, edit, and delete products, including details like name, price, stock, SKU, category, and image.
  - **Category Management**: Create, rename, and delete product categories.

## Tech Stack

- **React**: For building the user interface.
- **TypeScript**: For static typing and improved code quality.
- **Tailwind CSS**: For utility-first styling.
- **No Build Step**: The application runs directly in the browser using ES Modules and an import map, eliminating the need for complex build configurations.

## How to Run

This application is designed to run directly from the file system in a modern web browser.

1.  Clone or download the project files.
2.  You need to serve the files using a local web server. You cannot just open `index.html` directly due to browser security policies (CORS).
3.  A simple way to start a server is using Python:
    ```bash
    # Navigate to the project directory in your terminal
    cd path/to/project

    # If you have Python 3 installed:
    python -m http.server

    # If you have Python 2 installed:
    python -m SimpleHTTPServer
    ```
4.  Open your web browser and navigate to the local address provided by the server (e.g., `http://localhost:8000`).

Alternatively, you can use a browser extension like "Live Server" for Visual Studio Code.

## Data Persistence

All application data, including products, categories, the current order draft, and completed transaction history, is persistently stored in the browser's **Local Storage**. This ensures that your data is saved across browser sessions and enables the offline functionality.
