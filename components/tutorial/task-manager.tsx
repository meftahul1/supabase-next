"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TutorialStep } from "./tutorial-step";
import { Button } from "../ui/button";

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  image_url: string;
}

export function TaskManager() {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskImage, setTaskImage] = useState<File | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email || null);
    });
  }, []);

  const fetchTasks = async () => {
    if (!userEmail) return;

    const { error, data } = await supabase
      .from("tasks")
      .select("*")
      .eq("email", userEmail)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error reading task: ", error.message);
      return;
    }

    if (data) {
      setTasks(data);
    }
  };

  const deleteTask = async (id: number) => {
    if (!userEmail) return;

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("email", userEmail);

    if (error) {
      console.error("Error deleting task: ", error.message);
      return;
    }
    
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTask = async (id: number, newDescription: string) => {
    if (!userEmail) return;

    const { error } = await supabase
      .from("tasks")
      .update({ description: newDescription })
      .eq("id", id)
      .eq("email", userEmail);

    if (error) {
      console.error("Error updating task: ", error.message);
      return;
    }
    
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, description: newDescription } : t))
    );
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!userEmail) return null;
    const filePath = `${userEmail}/${file.name}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("tasks-images")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading image:", error.message);
      return null;
    }

    const { data } = await supabase.storage
      .from("tasks-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!newTask.title.trim() || !newTask.description.trim()) {
      alert("Please provide both a title and a description for your task.");
      return;
    }

    let imageUrl: string | null = null;

    if (taskImage) {
      imageUrl = await uploadImage(taskImage);
    }

    const { error } = await supabase
      .from("tasks")
      .insert({ ...newTask, email: userEmail, image_url: imageUrl })
      .select()
      .single();

    if (error) {
      console.error("Error adding task: ", error.message);
      return;
    }

    setNewTask({ title: "", description: "" });
    setTaskImage(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTaskImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchTasks();
    }
  }, [userEmail]);

  useEffect(() => {
    if (!userEmail) return;

    const channel = supabase.channel("tasks-channel");
    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tasks", filter: `email=eq.${userEmail}` },
        (payload) => {
          const newTask = payload.new as Task;
          setTasks((prev) => {
            if (prev.some((t) => t.id === newTask.id)) return prev;
            return [...prev, newTask];
          });
        }
      )
      .subscribe((status) => {
        console.log("Subscription: ", status);
      });
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userEmail]);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      {/* Form to add a new task */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-5" id="task-form">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full mb-2 p-2 border border-input rounded-md bg-background text-foreground"
          required
        />

        <textarea
          id="task-description"
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, description: e.target.value }))
          }

          className="w-full mb-2 p-2 border border-input rounded-md bg-background text-foreground"

          required
        />

        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full mb-2 p-2 border border-input rounded-md bg-background text-foreground" />

        <Button type="submit" className="mt-2 block w-full sm:w-auto">
          Add Task
        </Button>
      </form>

      {/* List of Tasks */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <TutorialStep
            key={task.id}
            task={task}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        ))}
      </ul>
    </div>
  );
}
