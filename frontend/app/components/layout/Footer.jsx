import Pokemon from "../pokemon/getPokemon";

export default function Footer() {
  return (
    <footer style={{ borderTop: "4px solid black", backgroundColor: "rgb(20, 40, 40)", justifyContent: "end", display: "flex" }} className="w-full mt-auto">
      <div className="flex px-15 py-6">
        <Pokemon/>
      </div>
    </footer>
  );
}