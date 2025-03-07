from contextlib import asynccontextmanager
from  fastapi  import  FastAPI
from fastapi.middleware.cors  import  CORSMiddleware
import uvicorn
from constants import SERVER_URL, PORT, ENV
from apps.Edutech.routes import router as EduTech_router



@asynccontextmanager
async def lifespan(app: FastAPI):
        yield

app = FastAPI(lifespan = lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins = [ "*" ],
    allow_credentials = True,
    allow_methods = [ "*" ],
    allow_headers = [ "*" ],
)

@app.get("/")
async def health():
    return { "message": "server is running" }

app.include_router(EduTech_router, prefix="/EduTech", tags=["EduTech"])

    
if __name__ == "__main__":
    uvicorn.run("main:app", host=SERVER_URL, port=int(PORT), reload=(ENV == "dev"))



# from contextlib import asynccontextmanager
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# import uvicorn
# from constants import SERVER_URL, PORT, ENV
# from apps.Edutech.routes import router as EduTech_router


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     yield


# app = FastAPI(lifespan=lifespan)

# # Adding CORS middleware before routes
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allow all origins temporarily for testing
#     allow_credentials=True,
#     allow_methods=["*"],  # Allow all methods
#     allow_headers=["*"],  # Allow all headers
# )


# @app.get("/")
# async def health():
#     return { "message": "server is running" }

# # Include your routes
# app.include_router(EduTech_router, prefix="/EduTech", tags=["EduTech"])

# if __name__ == "__main__":
#     uvicorn.run("main:app", host=SERVER_URL, port=int(PORT), reload=(ENV == "dev"))
