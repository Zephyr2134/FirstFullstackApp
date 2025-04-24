interface props{
    setIsMaking: (arg:boolean) =>void;
    setName: (arg:string)=>void;
    setType: (arg:string)=>void;
    handleImageUpload: (e:React.ChangeEvent<HTMLInputElement>)=>void;
    imageURL: string;
    PostPokemon: ()=>void;
}

const Making = ({setIsMaking, setName, setType, handleImageUpload, imageURL, PostPokemon} : props) =>{
    return (<div>
        <button
          className="relative transition-all duration-200 bg-green-600 p-[5px] border-black border-2 w-[110px] rounded left-[90vw] top-[20px] hover:bg-green-700 hover:translate-x-[-3px] hover:w-[116px]"
          onClick={() => setIsMaking(false)}
        >
          Stop making
        </button>
        <div className="relative left-145 bg-amber-200 rounded border-black border-2 grid space-y-10 p-10 w-[400px] h-[400px] align-middle">
          <input
            className="bg-amber-100 w-[300px] border-black border-2 rounded"
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          ></input>
          <input
            className="bg-amber-100 w-[300px] border-black border-2 rounded"
            type="text"
            placeholder="Type"
            onChange={(e) => setType(e.target.value)}
          ></input>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {imageURL && (
              <div>
                <img
                  src={imageURL}
                  alt="Preview"
                  className="w-[100px] h-[100px]"
                />
              </div>
            )}
          </div>
          <button
            onClick={() => PostPokemon()}
            className="relative transition-all duration-200 left-[0px] bg-green-600 rounded border-black border-2 w-[320px] hover:w-[340px] hover:left-[-10px] hover:bg-green-700 active:bg-amber-300"
          >
            Create pokemon entry
          </button>
        </div>
      </div>)
};

export default Making;