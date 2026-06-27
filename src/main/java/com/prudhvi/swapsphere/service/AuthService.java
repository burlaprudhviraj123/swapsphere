package com.prudhvi.swapsphere.service;


import com.prudhvi.swapsphere.dto.AuthResponse;
import com.prudhvi.swapsphere.dto.LoginRequest;
import com.prudhvi.swapsphere.dto.RegisterRequest;
import com.prudhvi.swapsphere.dto.UserResponse;
import com.prudhvi.swapsphere.entity.User;
import com.prudhvi.swapsphere.exception.BadRequestException;
import com.prudhvi.swapsphere.exception.UserNotFoundException;
import com.prudhvi.swapsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .collegeName(request.getCollegeName())
                .city(request.getCity())
                .pincode(request.getPincode())
                .build();

        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .phoneNumber(savedUser.getPhoneNumber())
                .collegeName(savedUser.getCollegeName())
                .city(savedUser.getCity())
                .pincode(savedUser.getPincode())
                .build();
    }

    public AuthResponse login(LoginRequest loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        User user = userRepository
                .findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .build();
    }
}
