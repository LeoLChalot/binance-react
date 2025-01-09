import React, { useState, useEffect } from "react";
import { DollarSign, Info, MessageCircle } from "lucide-react";

const SingleCoin = ({ cryptoId }) => {
  const [cryptoData, setCryptoData] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  const fetchComments = () => {
    const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
    const commentsForThisCrypto = storedComments[cryptoId] || [];
    setComments(commentsForThisCrypto);
  };


  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}`,
          {
            method: "GET",
            headers: {
              "x-cg-demo-api-key": import.meta.env.VITE_API_KEY,
            },
          }
        );
        const data = await response.json();
        setCryptoData(data);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };
  
    fetchCryptoData();
    fetchComments();
  }, [cryptoId]);
  

  if (!cryptoData) {
    return <div className="text-center text-gray-500">Chargement...</div>;
  }

  const handleCommentSubmit = () => {
    const newCommentObj = {
      idUser: `user_${Date.now()}`,
      comment: newComment,
      timestamp: new Date().toISOString(),
      upvote: 0,
      downvote: 0,
    };

    const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
    const updatedCommentsForCrypto = [
      ...(storedComments[cryptoId] || []),
      newCommentObj,
    ];

    localStorage.setItem(
      "comments",
      JSON.stringify({
        ...storedComments,
        [cryptoId]: updatedCommentsForCrypto,
      })
    );

    setComments(updatedCommentsForCrypto);
    setNewComment("");
  };

  const handleVote = (commentIndex, voteType) => {
    const updatedComments = [...comments];

    const comment = updatedComments[commentIndex];

    const userId = `user_${Date.now()}`; // Utiliser un vrai id de l'utilisateur connecté
    if (comment.votedByUser && comment.votedByUser === userId) {
      if (voteType === "upvote") {
        if (comment.upvote === 1) {
          comment.upvote = 0;
        } else {
          comment.upvote = 1;
          comment.downvote = 0;
        }
      } else if (voteType === "downvote") {
        if (comment.downvote === 1) {
          comment.downvote = 0;
        } else {
          comment.downvote = 1;
          comment.upvote = 0;
        }
      }
    } else {

      if (voteType === "upvote") {
        comment.upvote = 1;
        comment.downvote = 0;
        comment.votedByUser = userId;
      } else if (voteType === "downvote") {
        comment.downvote = 1;
        comment.upvote = 0;
        comment.votedByUser = userId;
      }
    }

    localStorage.setItem(
      "comments",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("comments")),
        [cryptoId]: updatedComments,
      })
    );
    setComments(updatedComments);
    console.log(localStorage);
  };


  return (
    <div className="flex gap-6 w-full">
        <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-center gap-4">
                <img
                    src={cryptoData.image.small}
                    alt={cryptoData.name}
                    className="w-12 h-12"
                />
                <h1 className="text-2xl font-bold">
                    {cryptoData.name} ({cryptoData.symbol.toUpperCase()})
                </h1>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
                <DollarSign className="w-6 h-6 text-green-500" />
                <span className="text-xl font-semibold">
                    {cryptoData.market_data.current_price.usd} USD
                </span>
                <span className="text-gray-500">
                    ({cryptoData.market_data.current_price.eur} EUR)
                </span>
            </div>

            <div className="w-3/6 mt-6 p-4 border rounded-lg bg-dark-50">
                <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-bold">Informations supplémentaires</h2>
                </div>
                <p className="text-sm text-gray-700">
                    Classement du marché : {cryptoData.market_cap_rank}
                </p>
                <p className="text-sm text-gray-700">
                    Volume total : {cryptoData.market_data.total_volume.usd} USD
                </p>
            </div>
        </div>

        {/* Bloc de droite - Section des commentaires */}
        <div className="flex-3 flex flex-col">
            <div>
            <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-bold">Commentaires</h2>
            </div>
            <textarea
                className="w-full p-2 border rounded-lg focus:ring focus:ring-purple-300"
                placeholder="Ajoutez vos commentaires sur cette crypto..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />
            <button
                className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg"
                onClick={handleCommentSubmit}
            >
                Ajouter
            </button>
            </div>

            <div className="mt-6 flex-1 overflow-y-auto border-t pt-4">
            <h3 className="text-lg font-semibold">Commentaires :</h3>
            {comments.length > 0 ? (
                comments.map((comment, index) => (
                <div
                    key={index}
                    className="p-4 border rounded-lg mb-2 bg-gray-50"
                >
                    <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                        {new Date(comment.timestamp).toLocaleString()} - {comment.idUser}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                        className="text-green-500"
                        onClick={() => handleVote(index, "upvote")}
                        >
                        ▲ {comment.upvote}
                        </button>
                        <button
                        className="text-red-500"
                        onClick={() => handleVote(index, "downvote")}
                        >
                        ▼ {comment.downvote}
                        </button>
                    </div>
                    </div>
                    <p className="text-gray-700">{comment.comment}</p>
                </div>
                ))
            ) : (
                <p className="text-gray-500">Aucun commentaire pour cette crypto.</p>
            )}
            </div>
        </div>
    </div>

  );
};

export default SingleCoin;
