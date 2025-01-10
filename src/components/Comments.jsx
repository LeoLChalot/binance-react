import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MessageCircle } from "lucide-react";

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

    const getUserNameById = (id) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((user) => user.id === id);
        return user ? user.email : "Utilisateur inconnu";
    };

    return (
        <div className="flex-3 flex flex-col">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold yellow-text">Partager votre avis !</h2>
                </div>
                <textarea
                    className="w-full p-2 border rounded-lg focus:ring focus:ring-purple-300"
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

            <div className="mt-6 flex-1 overflow-y-auto border-t pt-4">
                <h3 className="text-lg font-semibold yellow-text">Commentaires :</h3>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div
                            key={index}
                            className="p-4 border rounded-lg mb-2 bg-gray-50"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-500">
                                    {new Date(comment.timestamp).toLocaleString()} - {getUserNameById(comment.idUser)}
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
        </div>
    );
};

export default Comments;
