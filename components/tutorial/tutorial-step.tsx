"use client";

import { useState } from "react";
import { Button } from "../ui/button";

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  image_url: string;
}

export function TutorialStep({
  task,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onUpdate: (id: number, newDescription: string) => void;
  onDelete: (id: number) => void;
}) {
  const [newDescription, setNewDescription] = useState("");

  return (
    <li className="border border-border rounded-md p-4 mb-2 bg-card text-card-foreground shadow-sm">
      <div>
        <h3 className="text-xl font-bold mb-2">
          {task.title}
        </h3>
        <p className="mb-2 text-muted-foreground">{task.description}</p>
        
        {task.image_url && (
          <img 
            src={task.image_url} 
            alt={task.title}
            className="h-[70px] mb-2 rounded-md object-cover" 
          />
        )}
        
        <div className="mt-2">
          <textarea
            placeholder="Updated description..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full mb-2 p-2 border border-border rounded-md bg-background text-foreground"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onUpdate(task.id, newDescription);
                setNewDescription("");
              }}
            >
              Edit
            </Button>
            <Button
              className="bg-[#0d8f3a] hover:bg-[#0a702d] text-white"
              onClick={() => onDelete(task.id)}
            >
              Completed
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}
