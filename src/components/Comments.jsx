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
            idUser: user.id,
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
        if (commentToDelete.idUser !== user.id) {
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
        const userId = user.id;

        // Retirer l'utilisateur des deux listes de votes (upvote et downvote)
        comment.upvote = comment.upvote.filter((id) => id !== userId);
        comment.downvote = comment.downvote.filter((id) => id !== userId);

        // Ajouter l'utilisateur à la liste correspondante si ce n'est pas un retrait
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

    // Seems to be useless now
    
    // const getUserNameById = (id) => {
    //     return user ? user.accountData.email : "Utilisateur inconnu";
    // };

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
            filteredComments = commentsForThisCrypto.filter(comment => comment.idUser === user.id);
        } else if (filter === "date") { // Ajout de cette condition
            filteredComments = commentsForThisCrypto.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }
        setComments(filteredComments);
    };

    return (
        <div className="flex-3 flex flex-col">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold yellow-text">Partager votre avis !</h2>
                </div>
                <textarea
                    className="w-full p-2 border text-black rounded-lg focus:ring focus:ring-purple-300"
                    placeholder="Ajoutez vos commentaires sur cette crypto..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                    className="mt-2 px-4 py-2 bg-yellow text-white rounded-lg"
                    onClick={handleCommentSubmit}
                >
                    Ajouter
                </button>
            </div>
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
                        className="p-4 border rounded-lg mb-2 bg-gray-50"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">
                                {new Date(comment.timestamp).toLocaleString()} - {user ? user.accountData.email : "Utilisateur inconnu"}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    className="text-green-500"
                                    onClick={() => handleVote(index, "upvote")}
                                >
                                    ▲ {comment.upvote.length}
                                </button>
                                <button
                                    className="text-red-500"
                                    onClick={() => handleVote(index, "downvote")}
                                >
                                    ▼ {comment.downvote.length}
                                </button>
                                {comment.idUser === user.id && (
                                    <button
                                        className="text-gray-500"
                                        onClick={() => handleDeleteComment(index)}
                                    >
                                        Supprimer
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">Aucun commentaire pour cette crypto.</p>
            )}
        </div>
    );
};

export default Comments;
