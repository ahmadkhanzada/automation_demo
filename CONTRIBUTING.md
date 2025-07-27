# Contributing to Automation Demo

Thank you for your interest in contributing to the Automation Demo project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 8+
- Git

### Setup Development Environment
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/automation-demo.git
   cd automation-demo
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development servers:
   ```bash
   npm run dev
   ```

## 🧪 Running Tests

### All Tests
```bash
npm test
```

### Backend API Tests Only
```bash
npm run test:api
```

### Frontend E2E Tests Only
```bash
npm run test:ui
```

### Update Visual Snapshots
```bash
npm --workspace frontend run test:e2e:update-snapshots
```

## 📋 Development Guidelines

### Code Style
- Use ESLint and Prettier configurations
- Follow existing code patterns
- Write meaningful variable and function names
- Add comments for complex logic

### Commit Messages
Follow conventional commit format:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `test:` test additions/modifications
- `refactor:` code refactoring
- `style:` formatting changes

Example: `feat: add item validation endpoint`

### Pull Request Process

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Run tests** to ensure everything passes:
   ```bash
   npm test
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** with:
   - Clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all CI checks pass

## 🐛 Bug Reports

When reporting bugs, please include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Error messages or logs
- Screenshots if relevant

## 💡 Feature Requests

For new features, please:
- Check existing issues first
- Describe the use case
- Explain why it would be valuable
- Consider implementation complexity

## 🧪 Testing Guidelines

### Backend Tests
- Write tests for all new API endpoints
- Test both success and error cases
- Maintain 100% code coverage
- Use descriptive test names

### Frontend Tests
- Add E2E tests for new user flows
- Test error states and edge cases
- Update visual snapshots when UI changes
- Ensure tests are isolated and reliable

## 📚 Documentation

- Update README.md for setup changes
- Update TEST_PLAN.md for testing changes
- Add inline comments for complex code
- Keep documentation current with code changes

## 🔍 Code Review

All contributions go through code review:
- Be respectful and constructive
- Address feedback promptly
- Ask questions if unclear
- Learn from the process

## 📞 Getting Help

- Check existing issues and discussions
- Review documentation thoroughly
- Ask questions in pull request comments
- Be patient and respectful

## 🙏 Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Project documentation

Thank you for contributing to make this project better! 🎉
