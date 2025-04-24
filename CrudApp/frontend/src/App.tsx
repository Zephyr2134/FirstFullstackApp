import { useState, useEffect, useRef } from "react";
import "./index.css";
import Making from './pages/Making';

const BASE_URL = "https://localhost:5068";

interface Pokemon {
  id: number;
  name: string;
  type: string;
  imgUrl: string;
}

const App = () => {
  const [isMaking, setIsMaking] = useState<true | false>(false);
  const [isEditing, setIsEditing] = useState(0);
  const [imageURL, setImageUrl] = useState<string>("");
  const [Name, setName] = useState<string>("");
  const [Type, setType] = useState<string>("");

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleImageUpload = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try{
        const response = await fetch(`${BASE_URL}/api/sample/upload`, {
          method: "POST",
          body: formData,
        });

        if(response.ok){
          const data = await response.json();
          setImageUrl(data.imageUrl);
          console.log("Image uploaded successfully: ", data.imageUrl);
        }else{
          console.log("Image upload failed: ", response.status);
        }
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    }
  };

  const Edit = (id: number, name: string, type: string, imageUrl: string) => {
    setIsEditing(id);
    setName(name);
    setType(type);
    setImageUrl(imageUrl);
  }

  const PostPokemon = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/sample`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: Name,
          Type: Type,
          imgUrl: imageURL,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setPokemons((prev) => [...prev, data.value]);
        setIsMaking(false);
      } else {
        console.log(
          "Error adding pokemon: ",
          response.status
        );
      }
    } catch (error) {
      console.error("Error with the fetch request: ", error);
    }
  };

  const DeletePokemon = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/sample/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Deleted successfully: ", data);
        setPokemons((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.log(
          "Error deleting pokemon: ",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.log("Error with the fetch request: ", error);
    }
  };

  const UpdatePokemon = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/sample/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: Name,
          type: Type,
          imgUrl: imageURL,
        }),
      });
      if (response.ok) {
        await response.json();
        console.log("Succefully updated entry");
        setPokemons((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, name: Name, type: Type, imgUrl: imageURL } : p
          )
        );
      } else {
        console.log("Failed to update entry");
      }
    } catch (error) {
      console.log("Error updating entry");
    }
    setIsEditing(0);
  };

  useEffect(() => {
    const fetchItems = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/all?page=${page}`, {
          signal: abortControllerRef.current?.signal,
        });

        const pokemons = (await response.json()) as Pokemon[];
        setPokemons(pokemons);
      } catch (e: any) {
        if (e.name === "AbortError") {
          console.log("Aborted");
          return;
        }
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
    console.log(pokemons);
  }, [page]);

  return (
    <>
      <h1 className="relative text-6xl font-bold text-amber-300 border-amber-300 border-8 rounded-2xl bg-blue-600 text-center w-[500px] left-[35vw]">
        Pokemon
      </h1>
      <button
        className="bg-amber-400 w-[150px] h-[30px] rounded transition-all duration-200 hover:w-[170px] hover:bg-amber-500"
        onClick={() => setPage(page + 1)}
      >
        increase page ({page})
      </button>

      {error && <h1>Something went wrong! Please try again</h1>}
      {isMaking ? (
        Making({setIsMaking, setName, setType, handleImageUpload, imageURL, PostPokemon})
      ) : (
        <div className="relative bg-amber-200 top-[100px] h-[100px]">
          <button
            className="relative transition-all duration-200 bg-green-600 p-[5px] border-black border-2 w-[100px] rounded left-[90vw] top-[20px] hover:bg-green-700 hover:translate-x-[-2px] hover:w-[104px]"
            onClick={() => {
              setIsMaking(true);
            }}
          >
            Create new
          </button>
          <div className="relative top-[40px] flex flex-wrap p-[10px] space-x-10 w-[100%] bg-amber-100">
            {isLoading ? (
              <h1>isLoading...</h1>
            ) : (
              pokemons.map((p) => (
                <div
                  key={p.id}
                  className="item bg-amber-200 w-[330px] h-[150px] relative my-[20px] flex items-center justify-center border-black border-2"
                >
                  {p.id === isEditing ? (
                    <>
                      <div className="w-[100px] relative left-[-100px]">
                        <input
                          type="text"
                          value={Name}
                          className="relative bg-amber-300 rounded border-black border-2"
                          placeholder="Name"
                          onChange={(e) => setName(e.target.value)}
                        />
                        <input
                          type="text"
                          value={Type}
                          className="relative bg-amber-300 rounded border-black border-2"
                          placeholder="Type"
                          onChange={(e) => setType(e.target.value)}
                        />
                        <div>
                          <input
                            type="file"
                            className="relative"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          {imageURL && (
                            <div>
                              <img
                                src={imageURL}
                                alt="Preview"
                                className="relative"
                              />
                            </div>
                          )}
                        </div>
                        <button
                          className="transition-all duration-200 bg-green-500 rounded-xl border-black border-2 hover:bg-green-700"
                          onClick={() => UpdatePokemon(p.id)}
                        >
                          Update pokemon
                        </button>
                        <button
                          className="relative bg-red-400 rounded w-[100px] border-black border-2 transition-all duration-200 hover:bg-red-500 hover:w-[110px] hover:translate-x-[-5px]"
                          onClick={() => Edit(0,"","","")}
                        >
                          Stop editing
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <img className="w-[100px] h-[100px]" src={p.imgUrl}></img>
                      <div className="w-[180px]">
                        <h1 className="text-black">{p.name}</h1>
                      </div>
                      <button
                        className="bg-amber-400"
                        onClick={() => Edit(p.id, p.name, p.type, p.imgUrl)}
                      >
                        Edit
                      </button>
                      <button
                        className="relative transition-all duration-200 top-[-70px] right-[-20px] w-[25px] h-[25px] rounded-4xl border-black border-2 bg-red-500 hover:bg-red-700 hover:w-[30px] hover:h-[30px]"
                        onClick={() => {
                          DeletePokemon(p.id);
                        }}
                      >
                        X
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default App;
