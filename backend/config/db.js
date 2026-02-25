import "dotenv/config";
import mongoose from "mongoose";

const { MONGO_URL } = process.env;

export const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('✅ Conectado ao MongoDB com sucesso!');
    } catch (error) {
        console.log('❌ Erro ao conectar ao banco:', error.message);
        process.exit(1);
    }
};