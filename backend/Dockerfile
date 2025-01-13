# Use the official .NET 8 SDK for build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the project files
COPY *.csproj ./

# Restore the dependencies
RUN dotnet restore

# Copy the rest of the application files
COPY . ./

# Build and publish the application
RUN dotnet publish -c Release -o /app/publish

# Use the official .NET 8 runtime image for production
FROM mcr.microsoft.com/dotnet/aspnet:8.0

# Set the working directory in the container
WORKDIR /app

# Copy the published application from the build stage
COPY --from=build /app/publish .

# Set the environment variable for ASP.NET Core
ENV ASPNETCORE_ENVIRONMENT=Development

# Expose ports for HTTP and HTTPS
EXPOSE 5019
EXPOSE 7005

# Set the entry point
ENTRYPOINT ["dotnet", "YourApp.dll"]
