# Spotify Clone

## Description

Ce projet a pour but de créer un clone de Spotify, avec un backend développé en **Spring Boot 3**, un frontend en **Angular 17**, un design moderne avec **Bootstrap 5**, une base de données **PostgreSQL**, et une gestion de l'authentification via **Auth0**.

L'application permet aux utilisateurs de télécharger des morceaux de musique, de les écouter en streaming, de les rechercher et de gérer leurs morceaux favoris. Ce projet est conçu pour être une application fullstack robuste et moderne, et il permet de mettre en pratique des compétences dans des technologies largement utilisées aujourd'hui.

### Fonctionnalités principales

- **Authentification sécurisée avec Auth0 (Oauth2)** : Gestion de l'authentification des utilisateurs.

![01_Login](./documentation/images_app/01_Login.png)

- **Upload de musique** : Permet aux utilisateurs de télécharger des morceaux de musique.

![02_Add_Song](./documentation/images_app/02_Add_Song.png)

- **Streaming Audio** : Diffusion de musique en streaming.

![03_Home](./documentation/images_app/03_Home.png)

- **Recherche de musique** : Fonction permettant de rechercher des morceaux dans la bibliothèque.

![05_Search_Result](./documentation/images_app/05_Search_Result.png)

- **Gestion des favoris** : Les utilisateurs peuvent ajouter des morceaux à leurs favoris.

![04_Liked_Songs](./documentation/images_app/04_Liked_Songs.png)

- **UI responsive avec Bootstrap 5** : Interface utilisateur optimisée pour tous les appareils.
- **Nouvelles fonctionnalités d'Angular** : Utilisation de la version 17 d'Angular, avec des composants autonomes, Signal, et une nouvelle syntaxe de contrôle de flux.

## Structure du projet

Le projet est divisé en deux parties principales :

### 1. **Frontend (Angular 17)**

Le frontend est développé en **Angular 17** et utilise **Bootstrap 5** pour le design. L'application est responsive, permettant une utilisation fluide sur tous les types d'appareils.

**Répertoire Frontend** : `spotify-clone-front`

- **Technologies utilisées** : Angular 17, Bootstrap 5
- **Authentification** : Auth0 pour sécuriser l'accès des utilisateurs
- **Composants** : Signal, Standalone components
- **Fonctionnalités** :
  - Téléchargement de musique
  - Affichage des morceaux de musique
  - Gestion des favoris
  - Recherche de musique

## Usage

### Prerequisites
- NodeJS 20.11 LTS
- Angular CLI v17
- IDE (VSCode, IntelliJ, Webstorm)

### Fetch dependencies

```bash
npm install
```

### Launch dev server
Run `ng serve` for a dev server. Navigate to http://localhost:4200/. The application will automatically reload if you change any of the source files.

### Build
Run `ng build` to build the project. The build artifacts will be stored in the dist/ directory.

---

### 2. **Backend (Spring Boot 3)**

Le backend est construit avec **Spring Boot 3** et utilise **PostgreSQL** comme base de données. Il gère la logique de l'application, la gestion des utilisateurs, le téléchargement de la musique et la recherche.

**Répertoire Backend** : `spotify-clone-back`

- **Technologies utilisées** : Spring Boot 3, PostgreSQL, Auth0 pour l'authentification
- **Fonctionnalités** :
  - Gestion des utilisateurs et de l'authentification
  - Téléchargement et stockage des fichiers musicaux
  - Streaming audio
  - Recherche et gestion des favoris

## Usage

### Prerequisites
- JDK 21
- IDE (VS code, IntelliJ)
- PostgreSQL

### Setup .env file
Create a .env file at the root of the project

```
POSTGRES_USERNAME= 
POSTGRES_PASSWORD=
POSTGRES_URL=
POSTGRES_DB=

ISSUER=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
```

### Fetch the dependencies
```
./mvnw install -Dmaven.test.skip=true
```

### Launch
Go in your IDE and add .env file to the environment variables and then run it