"use client";
import { useQuery } from "@tanstack/react-query";
import { rootApi } from "@nndm/api/client";
import { Loader } from "@nndm/ui/loaders/loading-screen";
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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
        Welcome to Neural Network Design Assistant
      </h1>
      <p className="text-lg text-gray-600 max-w-xl text-center">
        Start building your neural network projects with ease. This is your main page.
      </p>
      <p className="text-lg text-gray-600 max-w-xl text-center">
        {" "}
        The message from backend is: {backendMessage}
      </p>
    </main>
  );
};
