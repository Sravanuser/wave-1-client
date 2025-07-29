import * as React from "react";
import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography,
    Stack,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const { setUser } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);
    const [serverError, setServerError] = React.useState("");
   
    useEffect(() => {
        if (serverError) {
            toast.error(serverError);
        }
    }, [serverError]);

    const onSubmit = async ({ email, password }) => {
        setServerError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                const message = data?.message || "Invalid credentials";
                setError("root", { type: "server", message });
                setServerError(message);
                return;
            }

            // success
            if (data.user) {
                localStorage.setItem("userData", JSON.stringify(data));
                setUser(data); // Update state
                toast.success("Login successful!");
            }

            // Redirect after state update
            navigate("/studies", { replace: true });
        } catch (e) {
            const message = "Something went wrong. Please try again.";
            setError("root", { type: "server", message });
            setServerError(message);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                    Sign in
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            placeholder="Email Address"
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <TextField
                            fullWidth
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            {...register("password", { required: "Password is required" })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ p: 1.5, fontWeight: "bold" }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing in..." : "SIGN IN"}
                        </Button>
                    </Stack>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <Link href="#" variant="body2">
                            Forgot password?
                        </Link>
                        <Link href="/register" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
