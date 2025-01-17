# Use the official .NET 8 runtime as the base image for the final image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5020

# Use the SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["backend.csproj", "./"]
RUN dotnet restore "backend.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "backend.csproj" -c Release -o /app/publish

# Copy the published output from the build stage to the base image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Copy the certificate into the container
COPY ./localhost.pfx /app/localhost.pfx


ENTRYPOINT ["dotnet", "backend.dll"]
