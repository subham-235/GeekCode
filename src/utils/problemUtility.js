const axios=require('axios');

const getlanguageById=(lang)=>{
    const language={
    "c++":54,
    "java":62,
    "javascript":63
    }

    return language[lang.toLowercase()];
}

const submitBatch=async (submission)=>{
const options = {
  method: 'POST',
  url: 'https://judge029.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'true'
  },
  headers: {
    'x-rapidapi-key': 'b89bc261d8msh13b49eb8d76f4bcp1e80a8jsn0f7ab1df7d3d',
    'x-rapidapi-host': 'judge029.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {submissions}
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

return await fetchData();


}

module.exports={getlanguageById,submitBatch};