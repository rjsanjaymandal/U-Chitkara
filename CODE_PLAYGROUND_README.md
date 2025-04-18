# Code Playground Feature

This feature allows users to write, run, and see the output of their code directly in the browser. It supports multiple programming languages and provides a VS Code-like editor experience.

## Features

- Monaco Editor (VS Code-like experience)
- Support for multiple programming languages (JavaScript, Python, C++, Java, C, Ruby, Go, Rust)
- Syntax highlighting
- Code execution with output display
- Standard input support
- Theme switching (Dark/Light)
- Font size adjustment

## Technical Implementation

### Frontend

- React component with Monaco Editor
- Language selection
- Theme selection
- Code execution with loading state
- Output display with proper formatting

### Backend

- Express route for code execution
- Integration with Judge0 API for secure code execution
- Rate limiting to prevent abuse (5 requests per minute per user)
- Error handling and proper response formatting

## Security Considerations

- Code is executed in a sandboxed environment via Judge0 API
- No code is executed on the application server
- Rate limiting is implemented to prevent abuse
- Authentication is required to use the code execution API

## Setup Instructions

### Environment Variables

Add the following to your `.env` file:

```
# Judge0 API Key (Get from RapidAPI)
JUDGE0_API_KEY=your_judge0_api_key_from_rapidapi
```

### Getting a Judge0 API Key

1. Go to [RapidAPI](https://rapidapi.com/)
2. Sign up or log in
3. Search for "Judge0 CE" API
4. Subscribe to a plan (they have a free tier)
5. Copy your API key from the dashboard

### Installation

1. Install the required packages:
   ```
   npm install @monaco-editor/react express-rate-limit
   ```

2. Set up the environment variables as described above

3. Restart the server

## Usage

1. Navigate to `/code-playground` in the application
2. Select a programming language
3. Write your code in the editor
4. (Optional) Provide standard input if your program requires it
5. Click "Run Code" to execute
6. View the output in the console panel

## Supported Languages

- JavaScript (Node.js)
- Python
- C++
- Java
- C
- Ruby
- Go
- Rust

## Limitations

- Execution time is limited (typically 5 seconds)
- Memory usage is limited (typically 128MB)
- Network access is not available in the execution environment
- File system access is limited in the execution environment
