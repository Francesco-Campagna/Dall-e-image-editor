package com.example.aiimageeditor_backend.Service;

import com.example.aiimageeditor_backend.Config.JwtTokenUtil;
import com.example.aiimageeditor_backend.Persistence.DAO.UserDao;
import com.example.aiimageeditor_backend.Persistence.DTO.LoginRequestDto;
import com.example.aiimageeditor_backend.Persistence.DTO.RegistrationRequestDto;
import com.example.aiimageeditor_backend.Persistence.Entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserDao userDao;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserDao userDao, @Lazy AuthenticationManager authenticationManager, JwtTokenUtil jwtTokenUtil, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> findAll() {
        return userDao.findAll();
    }

    @Override
    public Optional<User> findById(Long id) {
        return userDao.findById(id);
    }

    @Override
    public Optional<User> findByEmail(String email) { return Optional.ofNullable(userDao.findByEmail(email)); }

    @Override
    public User save(User user) {
        return userDao.save(user);
    }

    @Override
    public void deleteById(Long id) {
        userDao.deleteById(id);
    }


    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userDao.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + email);
        }
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .build();
    }

    @Override
    public ResponseEntity<?> registerUser(RegistrationRequestDto registrationRequest) {
        Optional<User> user = Optional.ofNullable(userDao.findByEmail(registrationRequest.getEmail()));
        if (user.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }
        System.out.println("EMAIL: "+registrationRequest.getEmail());
        System.out.println("PASSWORD: "+registrationRequest.getPassword());

        // Crea un nuovo utente
        User newUser = new User();
        newUser.setEmail(registrationRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        newUser.setName(registrationRequest.getName());
        newUser.setSurname(registrationRequest.getSurname());
        newUser.setPhone(registrationRequest.getPhone());

        userDao.save(newUser);

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registrationRequest.getEmail(), registrationRequest.getPassword())
        );

        String token = jwtTokenUtil.generateToken(newUser.getEmail());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);

        return ResponseEntity.ok().headers(headers).build();
    }

    @Override
    public ResponseEntity<?> loginUser(LoginRequestDto loginRequest) {
        // Effettua l'autenticazione
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        Optional<User> userDetails = Optional.ofNullable(userDao.findByEmail(loginRequest.getEmail()));
        String token = jwtTokenUtil.generateToken(userDetails.get().getEmail());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);


        return ResponseEntity.ok().headers(headers).build();
    }
}
