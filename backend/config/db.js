import "dotenv/config";
import mongoose from "mongoose";
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const { MONGO_URL } = process.env;

export const connectDb = async () => {
    try {
        console.log('🔄 Tentando conectar ao MongoDB...');
        
        await mongoose.connect(MONGO_URL, {
            serverSelectionTimeoutMS: 10000, 
            family: 4, 
        });
        
        console.log('✅ Conectado ao MongoDB com sucesso!');
    } catch (error) {
        console.log('❌ Erro ao conectar ao banco:', error.message);
        console.log('📌 Verifique sua conexão com a internet e se o IP está liberado no Atlas');
        process.exit(1);
    }
};