package com.app.backend.service;

import com.app.backend.dto.AuthRequest;
import com.app.backend.dto.AuthResponse;
import com.app.backend.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(AuthRequest request);

}

