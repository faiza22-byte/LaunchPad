// src/hooks/use-ideas.jsx
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

// Temporary API URL (replace with your backend)
const API_BASE = "https://api.example.com/ideas";

export function useIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIdeas() {
      try {
        const res = await fetch(API_BASE, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch ideas");
        const data = await res.json();
        setIdeas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchIdeas();
  }, []);

  return { ideas, loading, error };
}

export function useCreateIdea() {
  const { toast, ToastComponent } = useToast();

  async function createIdea(data) {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create idea");
      toast({ title: "Idea created!", description: "Your idea was saved." });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  return { createIdea, ToastComponent };
}

export function useDeleteIdea() {
  const { toast, ToastComponent } = useToast();

  async function deleteIdea(id) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete idea");
      toast({ title: "Deleted", description: "Idea removed." });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  return { deleteIdea, ToastComponent };
}