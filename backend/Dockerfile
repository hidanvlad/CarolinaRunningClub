FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiază fișierul de proiect și restaurează dependențele
COPY ["CarolinaRunningClub.Backend.csproj", "./"]
RUN dotnet restore "CarolinaRunningClub.Backend.csproj"

# Copiază restul codului și compilează aplicația
COPY . .
RUN dotnet publish "CarolinaRunningClub.Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa finală de rulare în producție
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render injectează automat portul în variabila de mediu PORT
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "CarolinaRunningClub.Backend.dll"]