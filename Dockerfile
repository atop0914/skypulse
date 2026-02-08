FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for better caching
COPY pyproject.toml uv.lock* ./

# Install uv
RUN curl -Ls https://github.com/astral-sh/uv/releases/download/v0.5.28/uv-x86_64-unknown-linux-gnu.tar.gz | tar -xz -C /usr/local/bin uv

# Install dependencies
RUN uv sync --frozen --no-dev

# Copy application code
COPY backend/src ./src

# Create non-root user
RUN useradd --create-home --shell /bin/bash appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uv", "run", "python", "-m", "weather_agent.main"]
