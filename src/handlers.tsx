import type { Task } from "./App";
import type { Dispatch, SetStateAction } from "react";

export type Selection = 'input' | number;

export const handleArrowUp = (
    selected: Selection,
    setSelected: Dispatch<SetStateAction<Selection>>,
    tasks: Task[]
) => {
    if (selected === 'input' && tasks.length > 0) {
        setSelected(tasks.length - 1);
    } else if (typeof selected === "number") {
        setSelected(Math.max(selected - 1, 0));
    }
};

export const handleArrowDown = (
    selected: Selection,
    setSelected: Dispatch<SetStateAction<Selection>>,
    tasks: Task[]
) => {
    if (typeof selected === "number") {
        // If the selected task is the last task in the list, go to the input
        if (selected === tasks.length - 1) {
            setSelected('input');
        } else {
            setSelected(selected + 1);
        }
    }
};

export const handleInputEnter = (
    inputValue: string,
    addTask: (text: string) => void,
    setInputValue: Dispatch<SetStateAction<string>>
) => {
    if (inputValue.trim()) {
        addTask(inputValue);
        setInputValue('');
    }
};

export const handleTaskDelete = (
    tasks: Task[],
    setTasks: Dispatch<SetStateAction<Task[]>>,
    selected: Selection,
    setSelected: Dispatch<SetStateAction<Selection>>
) => {
    if (typeof selected !== 'number') return;

    const newTasks = tasks.filter((_, i) => i !== selected);
    setTasks(newTasks);
    setSelected(selected === 0 ? 'input' : selected - 1);
};

export const handleTaskComplete = (
    selected: number,
    tasks: Task[],
    setTasks: Dispatch<SetStateAction<Task[]>>
) => {
    setTasks(
        tasks.map((task, index) =>
            index === selected ? { ...task, completed: !task.completed } : task
        )
    );
};
