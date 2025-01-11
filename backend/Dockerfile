# Use the official .NET 7 SDK for build
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

WORKDIR /app
COPY *.csproj ./
RUN dotnet restore
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# Use the official .NET 7 runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0

WORKDIR /app
COPY --from=build /app/publish .

# Set the environment variable for ASP.NET Core
ENV ASPNETCORE_ENVIRONMENT=Development

# Expose ports for HTTP and HTTPS
EXPOSE 5019
EXPOSE 7005

# Set the entry point
ENTRYPOINT ["dotnet", "YourApp.dll"]
