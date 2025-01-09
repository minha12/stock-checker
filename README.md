# Stock Price Checker

A modern web application for checking and comparing NASDAQ stock prices with social features. Built with Node.js and MongoDB.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)

## Features

- ✨ Real-time stock price checking
- 🔄 Compare multiple stocks
- 👍 Social likes system
- 📱 Responsive design
- 🔒 IP-based like limitation
- 📊 Clean API documentation

## Technology Stack

- **Frontend:**
  - HTML5 & CSS3
  - JavaScript (ES6+)
  - jQuery
  - Modern responsive design with CSS Grid/Flexbox
  - Inter font family for improved readability

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (with MongoDB Node.js Driver)
  - RESTful API architecture

- **External Services:**
  - Stock price data from FreeCodeCamp proxy API
  - MongoDB Atlas for database hosting

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (≥14.0.0)
- MongoDB (≥4.4)
- npm (≥6.0.0)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stock-checker.git
   cd stock-checker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   DB=mongodb://your-mongodb-connection-string
   PORT=3000
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Documentation

### GET /api/stock-prices

Get stock prices and likes information.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| stock | string/array | Yes | Stock symbol(s) |
| like | boolean | No | Like the stock |

#### Example Requests

```http
GET /api/stock-prices?stock=AAPL
GET /api/stock-prices?stock=AAPL&like=true
GET /api/stock-prices?stock=AAPL&stock=GOOGL
```

#### Example Response

```json
{
  "stockData": {
    "stock": "AAPL",
    "price": "150.10",
    "likes": 1
  }
}
```

## Testing

Run the test suite:
```bash
npm test
```

## Security Features

- Content Security Policy (CSP) implementation
- IP-based like limitation
- Input validation and sanitization
- MongoDB injection prevention
- Rate limiting on API endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- FreeCodeCamp for the original project idea and API proxy
- MongoDB for the database platform
- The Node.js community for excellent tools and libraries

---
Made with ❤️ by [Your Name]


