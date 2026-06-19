import { mount } from "svelte";
import App from "./app/App.svelte";
import "./styles/index.css";

export default mount(App, { target: document.getElementById("root") });
