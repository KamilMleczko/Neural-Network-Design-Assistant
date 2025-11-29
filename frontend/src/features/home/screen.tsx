"use client";
import { rootApi } from "@nndm/api/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@nndm/ui/button";
import { Container } from "@nndm/ui/custom/container";
import { Loader } from "@nndm/ui/loading-screen";
export const HomeScreen = () => {
  const { data: backendMessage, isLoading } = useQuery({
    //rename data to backendMessage
    queryKey: ["root"], //the key to identify this query (for more complex queries add their arguments to the key)
    // like ['user', userId] or ['posts', { authorId, status, page }]
    queryFn: rootApi.getRoot, // just imported procedure
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-center">Welcome to Neural Network Design Assistant</h1>
        <p className="text-center">
          Start building your neural network projects with ease. This is your main page.
        </p>
        <p className="text-center"> The message from backend is:</p>
        <Button onClick={() => alert(backendMessage.message)} variant="default">
          Click to see the message
        </Button>
      </main>
    </Container>
  );
};
