import { useState } from "react";
import { Container, Input, Button, VStack, Text, Box, Image } from "@chakra-ui/react";
import axios from "axios";

const Index = () => {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");

  const searchSongs = async () => {
    setError("");
    try {
      const tokenResponse = await axios.post("https://accounts.spotify.com/api/token", null, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa("4642e3fdf761477991140a71ec36597e:1f1ef85b93cc467290f77cdcca6b5cd1")}`,
        },
        params: {
          grant_type: "client_credentials",
        },
      });

      const token = tokenResponse.data.access_token;

      const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          type: "track",
        },
      });

      setSongs(response.data.tracks.items);
    } catch (err) {
      setError("Failed to fetch songs. Please try again.");
      console.error(err);
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Spotify Song Search</Text>
        <Input
          placeholder="Search for a song"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={searchSongs} colorScheme="teal">Search</Button>
        {error && <Text color="red.500">{error}</Text>}
        <VStack spacing={4} width="100%">
          {songs.map((song) => (
            <Box key={song.id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" p={4}>
              <Text fontSize="lg" fontWeight="bold">{song.name}</Text>
              <Text>{song.artists.map(artist => artist.name).join(", ")}</Text>
              {song.album.images.length > 0 && (
                <Image src={song.album.images[0].url} alt={song.name} boxSize="100px" objectFit="cover" />
              )}
              <audio controls>
                <source src={song.preview_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default Index;