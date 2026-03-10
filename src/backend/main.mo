import Time "mo:core/Time";
import List "mo:core/List";

actor {
  type ContactSubmission = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  let contactSubmissions = List.empty<ContactSubmission>();

  public shared ({ caller }) func submitContact(name : Text, email : Text, message : Text) : async () {
    let submission : ContactSubmission = {
      name;
      email;
      message;
      timestamp = Time.now();
    };
    contactSubmissions.add(submission);
  };

  public query ({ caller }) func getContactSubmissions() : async [ContactSubmission] {
    contactSubmissions.toArray();
  };
};
