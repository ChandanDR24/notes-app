import {
  Box,
  Button,
  Image,
  Flex,
  VStack,
  Text,
  IconButton,
  HStack,
  Input,
  Textarea,
  Stack,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from"../services/api";


type Note = {
  _id: string;
  title: string;
  content: string;
};

const Dashboard = () => {
  const { name, logout, email } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const fetchNotes = async () => {
    console.log("Token used:", localStorage.getItem("token"));
    try {
      const res = await api.get("https://notes-app-x9br.onrender.com/api/notes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotes(res.data);
    } catch {
      toast.error("Failed to fetch notes.");
    }
  };

  const handleCreateNote = async () => {
    console.log("Token used:", localStorage.getItem("token"));
    if (!newTitle.trim() || !newContent.trim()) {
      toast.warn("Please fill in both fields.");
      return;
    }

    try {
      await api.post(
        "https://notes-app-x9br.onrender.com/api/notes",
        { title: newTitle, content: newContent },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Note created!");
      setNewTitle("");
      setNewContent("");
      setShowCreateForm(false);
      fetchNotes();
    } catch {
      toast.error("Failed to create note");
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await api.delete(`https://notes-app-x9br.onrender.com/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.info("Note deleted");
      fetchNotes();
    } catch {
      toast.error("Failed to delete note");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Box bg="white" minH="100vh" px={{ base: 4, md: 8 }} py={6}>
      {/* Header */}
      <Flex
        direction={{ sm: "row" }}
        justify="space-between"
        align={{ base: "flex-start", sm: "center" }}
        mt={4}
        mb={6}
        gap={4}
      >
        <HStack gap={2}>
          <Image boxSize={{ base: "30px", md: "40px" }} src="/logo.png" alt="Logo" />
          <Text fontSize={{ base: "2xl", md: "3xl" }} color="black" fontWeight="medium">
            Dashboard
          </Text>
        </HStack>
        <Button
          color="blue"
          fontWeight="medium"
          textDecoration="underline"
          onClick={logout}
          size={{ base: "sm", md: "md" }}
        >
          Sign Out
        </Button>
      </Flex>

      {/* Welcome card */}
      <Box mb={4} p={4} borderRadius="lg" boxShadow="md">
        <Text fontSize="lg" color="black" fontWeight="bold">
          Welcome, {name}!
        </Text>
        <Text fontSize="sm" color="gray.700">
          Email: {email}
        </Text>
      </Box>

      {/* Toggle Create Note Form */}
      <Flex justify="center">
        <Button
          colorPalette="blue"
          w={{ base: "100%", sm: "200px" }}
          mb={showCreateForm ? 2 : 4}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "Create Note"}
        </Button>
      </Flex>

      {/* Create Form */}
      {showCreateForm && (
        <Box
          mb={4}
          p={4}
          border="1px solid #E2E8F0"
          borderRadius="md"
          bg="gray.50"
        >
          <Stack>
            <Input
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              color="black"
            />
            <Textarea
              placeholder="Content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              color="black"
            />
            <Button
              colorPalette="blue"
              w={{ base: "100%", sm: "200px" }}
              onClick={handleCreateNote}
              alignSelf="center"
            >
              Create
            </Button>
          </Stack>
        </Box>
      )}

      {/* Notes List */}
      <Text fontWeight="semibold" color="black" mb={2}>
        Notes
      </Text>

      {notes.length === 0 ? (
        <Text color="gray.500" textAlign="center">
          No Worries Just Create it!!!
        </Text>
      ) : (
        <VStack align="stretch">
          {notes.map((note) => (
            <Flex
              key={note._id}
              p={3}
              rounded="md"
              shadow="sm"
              align={{ base: "flex-start", md: "center" }}
              justify="space-between"
              direction={{  md: "row" }}
              gap={2}
            >
              <Box w="100%">
                <Text fontWeight="bold" color="black">
                  {note.title}
                </Text>
                <Text fontSize="sm" color="gray.800">
                  {note.content}
                </Text>
              </Box>
              <IconButton
                aria-label="Delete note"
                size="md"
                _icon={{ fontSize: "20px", color: "black" }}
                onClick={() => handleDeleteNote(note._id)}
              >
                <MdDelete />
              </IconButton>
            </Flex>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default Dashboard;
