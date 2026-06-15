import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(null); // let Remotion choose based on the machine
Config.setChromiumOpenGlRenderer("angle");
