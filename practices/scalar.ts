import * as tf from "@tensorflow/tfjs";

const s1 = tf.scalar(-100);
s1.print(true);
s1.abs().print(true);
tf.linspace(0, 100, 10000).print(true);
