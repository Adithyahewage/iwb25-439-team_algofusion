# Use official Ballerina runtime image
FROM ballerina/ballerina:2201.8.0

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build the project
RUN bal build

# Expose port
EXPOSE 8080

# Run the service
CMD ["bal", "run", "target/bin/trackme.jar"] 