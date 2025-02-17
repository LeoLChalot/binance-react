import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ArrowBigUp, MessageCircle } from "lucide-react";

const Comments = ({ cryptoId }) => {
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchComments = () => {
            const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
            const commentsForThisCrypto = storedComments[cryptoId] || [];
            setComments(commentsForThisCrypto);
        };

        fetchComments();
    }, [cryptoId]);

    const handleCommentSubmit = () => {
        if (newComment.trim() === "") {
            alert("Le commentaire ne peut pas être vide.");
            return;
        }

        const newCommentObj = {
            idUser: user.accountData.id,
            comment: newComment,
            timestamp: new Date().toISOString(),
            upvote: [],
            downvote: [],
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

    const handleDeleteComment = (index) => {
        const commentToDelete = comments[index];
        if (commentToDelete.idUser !== user.accountData.id) {
            alert("Vous ne pouvez supprimer que vos propres commentaires.");
            return;
        }

        const updatedComments = comments.filter((_, i) => i !== index);

        const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
        storedComments[cryptoId] = updatedComments;
        localStorage.setItem("comments", JSON.stringify(storedComments));

        setComments(updatedComments);
    };

    const handleVote = (commentIndex, voteType) => {
        const updatedComments = [...comments];
        const comment = updatedComments[commentIndex];
        const userId = user.accountData.id;

        comment.upvote = comment.upvote.filter((id) => id !== userId);
        comment.downvote = comment.downvote.filter((id) => id !== userId);

        if (voteType === "upvote") {
            comment.upvote.push(userId);
        } else if (voteType === "downvote") {
            comment.downvote.push(userId);
        }

        const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
        storedComments[cryptoId] = updatedComments;
        localStorage.setItem("comments", JSON.stringify(storedComments));

        setComments(updatedComments);
    };


    const getUserNameById = (id) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((user) => user.accountData.id === id);
        return user ? user.accountData.email : "Utilisateur inconnu";
    };

    const getUserEmailById = (id) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((user) => user.accountData.id === id);
        return user ? user.accountData.email : "unknown";
    };

    const handleFilter = (e) => {
        const filter = e.target.value;
        const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
        const commentsForThisCrypto = storedComments[cryptoId] || [];
        let filteredComments = commentsForThisCrypto;
        if (filter === "upvoted") {
            filteredComments = commentsForThisCrypto.filter(comment => comment.upvote.length > 0);
        } else if (filter === "downvoted") {
            filteredComments = commentsForThisCrypto.filter(comment => comment.downvote.length > 0);
        } else if (filter === "mine") {
            filteredComments = commentsForThisCrypto.filter(comment => comment.idUser === user.accountData.id);
        } else if (filter === "date") {
            filteredComments = commentsForThisCrypto.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }
        setComments(filteredComments);
    };

    return (
        <div className="bg-zinc-900 rounded-xl p-6 w-full mx-auto">
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-xl font-bold text-white">Partager votre avis !</h2>
                </div>
                <textarea
                    className="w-full p-4 bg-black my-4 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                    placeholder="Ajoutez vos commentaires sur cette crypto..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows="3"
                />
                <button
                    className="mt-3 px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2 ml-auto"
                    onClick={handleCommentSubmit}
                >
                    <MessageCircle size={16} />
                    Ajouter
                </button>
            </div>

            <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-3 text-left">
                    Commentaires
                </h3>
                <div className="mt-6 overflow-y-auto border-t pt-4">
                    <h3 className="text-lg font-semibold yellow-text">Commentaires :</h3>
                    <div className="mb-4"></div>
                    <select
                        id="filter"
                        className="mt-1 mx-auto block pl-3 pr-10 py-2 my-4 text-base text-black border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        onChange={(e) => handleFilter(e)}
                    >
                        <option value="all">Tous les commentaires</option>
                        <option value="mine">Mes commentaires</option>
                        <option value="date">Date de publication<ArrowBigUp /></option>
                        <option value="upvoted">Commentaires <span className="text-green-500">▲</span></option>
                        <option value="downvoted">Commentaires <span className="text-red-500">▼</span></option>
                    </select>
                </div>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div
                            key={index}
                            className="bg-gray-700/35 rounded-lg p-4 border border-gray-600 group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(getUserEmailById(comment.idUser))}`}
                                        alt="Avatar"
                                        className="w-8 h-8 rounded-full bg-gray-600"
                                    />
                                    <div>
                                        <h4 className="text-white font-medium">
                                            {getUserNameById(comment.idUser)}
                                        </h4>
                                        <span className="text-sm text-gray-400">
                                            {new Date(comment.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-auto">
                                    <button
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${comment.upvote.includes(user.accountData.id)
                                            ? "text-green-500 bg-green-500/10"
                                            : "text-gray-400 hover:text-green-500 hover:bg-green-500/10"
                                            }`}
                                        onClick={() => handleVote(index, "upvote")}
                                    >
                                        ▲ <span>{comment.upvote.length}</span>
                                    </button>
                                    <button
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${comment.downvote.includes(user.accountData.id)
                                            ? "text-red-500 bg-red-500/10"
                                            : "text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                                            }`}
                                        onClick={() => handleVote(index, "downvote")}
                                    >
                                        ▼ <span>{comment.downvote.length}</span>
                                    </button>
                                    {comment.idUser === user.accountData.id && (
                                        <button
                                            className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-md group-hover:opacity-100 transition-all"
                                            onClick={() => handleDeleteComment(index)}
                                        >
                                            Supprimer
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-300 ml-11 text-left">{comment.comment}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-400">Aucun commentaire pour cette crypto.</p>
                        <p className="text-sm text-gray-500 mt-1">Soyez le premier à donner votre avis !</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comments;
