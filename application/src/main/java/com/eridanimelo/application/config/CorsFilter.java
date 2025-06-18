// package com.eridanimelo.application.config;

// import jakarta.servlet.*;
// import jakarta.servlet.http.HttpServletResponse;
// import org.springframework.stereotype.Component;
// import java.io.IOException;

// @Component
// public class CorsFilter implements Filter {

// @Override
// public void doFilter(ServletRequest request, ServletResponse response,
// FilterChain chain)
// throws IOException, ServletException {
// HttpServletResponse res = (HttpServletResponse) response;
// res.setHeader("Access-Control-Allow-Origin", "*"); // ⚠️ Permitir Angular
// res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,
// OPTIONS");
// res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type,
// X-Requested-With");
// res.setHeader("Access-Control-Allow-Credentials", "true");

// chain.doFilter(request, response);
// }
// }
