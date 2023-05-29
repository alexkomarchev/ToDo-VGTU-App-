import React from "react";

import "./App.css";

import {
  Button,
  TextField,
  Box,
  Typography,
  Checkbox,
  Tab,
  Tabs,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";

const getTime = () => {
  const date = new Date();

  return `${date.getHours()}:${date.getMinutes()}`;
};

const Todo = ({
  title,
  completed,
  date,
  uid,
  changeTodo,
  deleteTodo,
  isRemove,
  restoreTodo,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        widht: "100%",
        overflow: "hidden",
        marginBottom: 1.5,
        borderRadius: "10px",
        padding: 1,
        boxShadow:
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        sx={{ width: "90%", overflow: "hidden" }}
      >
        <Checkbox
          disabled={isRemove}
          onChange={() => changeTodo(uid)}
          checked={completed}
        />
        <Typography
          sx={{
            marginBottom: "2px",
            textDecoration: completed ? "line-through" : "none",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            marginLeft: "7px",
            marginBottom: "2px",
            color: "gray",
            fontSize: "14px",
          }}
        >
          {date}
        </Typography>
      </Box>
      {!isRemove ? (
        <DeleteIcon
          onClick={() => deleteTodo(uid)}
          sx={{ cursor: "pointer", color: "#e34234" }}
        />
      ) : (
        <RestoreIcon
          onClick={() => restoreTodo(uid)}
          sx={{ cursor: "pointer" }}
        />
      )}
    </Box>
  );
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function App() {
  const [text, setText] = React.useState("");

  const [tabValue, setTabValue] = React.useState(0);

  const [todos, setTodos] = React.useState(
    JSON.parse(localStorage.getItem("todos")) || []
  );

  const [filtersTodos, setFiltersTodos] = React.useState(todos);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [removesTodos, setRemovesTodos] = React.useState(
    JSON.parse(localStorage.getItem("removeTodos")) || []
  );

  const addTodo = () => {
    if (text.trim()) {
      setTodos((prev) => [
        ...prev,
        {
          title: text,
          completed: false,
          date: getTime(),
          uid: Date.now(),
          isRemove: false,
        },
      ]);
      localStorage.setItem("todos", JSON.stringify(todos));
      setText("");
    }
  };

  const changeTodo = (uid) => {
    setTodos((prev) =>
      prev.map((el) => {
        if (el.uid === uid) {
          el.completed = !el.completed;
        }

        return el;
      })
    );
  };

  const deleteTodo = (uid) => {
    const removeItem = todos.filter((el) => el.uid === uid)[0];
    removeItem.isRemove = true;
    setRemovesTodos((prev) => [...prev, removeItem]);
    setTodos((prev) => prev.filter((el) => el.uid !== uid));

  };

  const restoreTodo = (uid) => {
    const item = removesTodos.filter((el) => el.uid === uid)[0];
    item.isRemove = false;
    setRemovesTodos((prev) => prev.filter((el) => el.uid !== uid));
    setTodos((prev) => [...prev, item]);

  };


  React.useEffect(
    () => localStorage.setItem("removeTodos", JSON.stringify(removesTodos)),
    [removesTodos]
  );

  React.useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  React.useEffect(() => {
    if (tabValue === 0) {
      setFiltersTodos(todos);
    }

    if (tabValue === 1) {
      setFiltersTodos(todos.filter((todo) => todo.completed));
    }

    if (tabValue === 2) {
      setFiltersTodos(todos.filter((todo) => !todo.completed));
    }

    if (tabValue === 3) {
      setFiltersTodos(removesTodos);
    }
  }, [tabValue]);

  React.useEffect(() => setFiltersTodos(todos), [todos]);

  return (
    <Box
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          addTodo();
        }
      }}
      sx={{
        width: 600,
        height: 600,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box display="flex" alignItems="center" sx={{ width: "100%" }}>
        <TextField
          value={text}
          fullWidth
          size="small"
          onChange={(e) => setText(e.target.value)}
          placeholder="Ваша задача"
        />
        <Button
          onClick={addTodo}
          sx={{ marginLeft: 2, height: "100%" }}
          variant="contained"
        >
          Добавить
        </Button>
      </Box>
      <Tabs
        sx={{ marginRight: "auto", marginTop: 1 }}
        value={tabValue}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab label="Все" {...a11yProps(0)} />
        <Tab label="Завершенные" {...a11yProps(1)} />
        <Tab label="Незавершенные" {...a11yProps(2)} />
        <Tab label="Удалённые" {...a11yProps(3)} />
      </Tabs>
      <Box sx={{ marginTop: 2.5, width: "81%", marginRight: "auto" }}>
        {todos.length === 0 && removesTodos.length === 0 ? (
          <Typography>Пока вы не добавили никакие задачи.</Typography>
        ) : (
          <Box>
            {filtersTodos.map((todo) => (
              <Todo
                key={todo.key}
                title={todo.title}
                completed={todo.completed}
                date={todo.date}
                changeTodo={changeTodo}
                deleteTodo={deleteTodo}
                uid={todo.uid}
                isRemove={todo.isRemove}
                restoreTodo={restoreTodo}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default App;
