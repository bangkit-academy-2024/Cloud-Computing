# API Documentation

> API ini dirancang untuk mendukung backend proyek Capstone dalam program Bangkit. Proyek ini terintegrasi dengan MD, memungkinkan kolaborasi dan pertukaran data yang lebih baik antar komponen sistem. Dengan API ini, pengembang dapat mengakses dan mengelola fungsi yang diperlukan untuk menjalankan aplikasi dengan lancar.

## Base URL
https://www.epialert.my.id

## Endpoints

### 1. Register User
- **URL**: `/api/register`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "username": "string", // Harus unik
        "name": "string",
        "email": "string", // Harus unik
        "password": "string" // Minimal 6 karakter
    }
    ```
- **Response**:
    ```json
    {
        "status": true,
        "message": "string",
        "user": {
            "username": "string",
            "name": "string",
            "email": "string",
            "history": [{}]
        }
    }
    ```

### 2. Login User
- **URL**: `/api/login`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "account": "string", // Email atau username
        "password": "string"
    }
    ```
- **Response**:
    ```json
    {
        "status": true,
        "message": "string",
        "token": "string",
        "user": {
            "username": "string",
            "name": "string",
            "email": "string",
            "history": [{}]
        }
    }
    ```

### 3. Show Profile
- **URL**: `/api/user`
- **Method**: `GET`
- **Headers**:
    - `Authorization`: `Bearer <token>`
- **Response**:
    ```json
    {
        "status": true,
        "user": {
            "username": "string",
            "name": "string",
            "email": "string",
            "history": [{}],
            "createdAt": "2024-11-29T11:58:15.399Z",
            "updatedAt": "2024-11-29T11:58:15.399Z"
        }
    }
    ```

### 4. Delete Profile
- **URL**: `/api/user`
- **Method**: `DELETE`
- **Headers**:
    - `Authorization`: `Bearer <token>`
- **Response**:
    ```json
    {
        "status": true,
        "message": "string"
    }
    ```

### 5. List All Users
- **URL**: `/api/listuser`
- **Method**: `GET`
- **Headers**:
    - `Authorization`: `Bearer <token>`
- **Response**:
    ```json
    {
        "status": true,
        "list": [
            {
                "username": "string",
                "name": "string",
                "email": "string",
                "history": [{}]
            }
        ]
    }
    ```

## Catatan
- Pastikan untuk menyertakan token yang valid dalam header Authorization untuk akses ke endpoint yang memerlukan otorisasi.