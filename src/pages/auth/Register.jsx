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
    Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const {
        register,
        handleSubmit,
        watch,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();
    const Navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const password = watch("password");

    const onSubmit = async ({ username, email, password }) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Try to surface field specific errors if your API returns them
                // Example shape assumed: { errors: { username: "...", email: "..." }, message: "..." }
                if (data?.errors) {
                    Object.entries(data.errors).forEach(([field, message]) => {
                        setError(field, { type: "server", message });
                    });
                }

                setError("root", {
                    type: "server",
                    message: data?.message || "Registration failed. Please try again.",
                });
                return;
            }

            // Success – do whatever you want (redirect, toast, etc.)
            alert("Account created! You can log in now.");
            reset();
            Navigate("/")
        } catch (err) {
            setError("root", {
                type: "server",
                message: "Network error. Please check your connection and try again.",
            });
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
                    Create your account
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
                    <Stack spacing={2}>
                        {errors.root?.message && (
                            <Alert severity="error">{errors.root.message}</Alert>
                        )}

                        <TextField
                            fullWidth
                            placeholder="Username"
                            {...register("username", { required: "Username is required" })}
                            error={!!errors.username}
                            helperText={errors.username?.message}
                        />

                        <TextField
                            fullWidth
                            placeholder="Email Address"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: "Enter a valid email",
                                },
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <TextField
                            fullWidth
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Min 6 characters" },
                            })}
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

                        <TextField
                            fullWidth
                            placeholder="Confirm Password"
                            type={showConfirm ? "text" : "password"}
                            {...register("confirmPassword", {
                                required: "Confirm your password",
                                validate: (val) => val === password || "Passwords do not match",
                            })}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirm((p) => !p)} edge="end">
                                            {showConfirm ? <VisibilityOff /> : <Visibility />}
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
                            {isSubmitting ? "Creating..." : "SIGN UP"}
                        </Button>
                    </Stack>

                    <Box sx={{ textAlign: "center", mt: 2 }}>
                        <Link href="/" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
