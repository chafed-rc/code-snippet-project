"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLogin } from "@/hooks/use-login";
import { useAuth } from "@/hooks/use-auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const LoginModal = () => {
  const loginModal = useLogin();
  const { login, setLoading, loading } = useAuth(); // Include loading state from useAuth
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      console.log("Received token:", data.token); 
      localStorage.setItem('token', data.token)

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      login({ 
        id: data.user.id, 
        username: data.user.username, 
        email: data.user.email 
      }, data.token);
      toast.success("Logged in successfully");
      loginModal.onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={loginModal.isOpen} onOpenChange={loginModal.onClose}>
      <DialogContent className="w-[90%]" aria-describedby="login-description">
        <DialogHeader className="border-b pb-3">
          <DialogTitle>Login to Your Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="mt-4" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Button variant={"link"}>Forgot password?</Button>
          <Button variant={"link"}>Don't have an account? Sign Up</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
